<template>
  <v-menu v-model="menuActive" attached>
    <template #activator="{ toggle }">
      <v-input
        :data-tooltip="tooltipContent"
        class="input-formula"
        :disabled="disabled"
      >
        <template #input>
          <div v-if="tooltipEnable" class="tooltip bottom">
            <span v-if="tooltipContent">{{ tooltipContent }}</span>
            <div v-else>
              Examples:
              <p>- Price * Quantity</p>
              <p>- SUM(field1, field2, field3)</p>
              <p>- IF(debt == 0, "Done", "On Progress")</p>
            </div>
          </div>
          <span
            ref="contentEl"
            class="content"
            :contenteditable="!disabled"
            @keydown="onKeyDown"
            @input="onInput"
            @click="onClick"
            @blur="tooltipEnable = false"
          >
            <span class="text" />
          </span>
          <span v-if="placeholder && !modelValue" class="placeholder">{{
            placeholder
          }}</span>
        </template>

        <template #append>
          <v-icon
            name="add_box"
            outline
            clickable
            :disabled="disabled"
            @click="toggle"
          />
        </template>
      </v-input>
    </template>

    <v-list v-if="!disabled" :mandatory="false">
      <v-list-item :disabled="true">FIELDS</v-list-item>
      <v-list-item
        v-for="field in fields"
        :key="`field-${field.field}`"
        clickable
        :value="field.field"
        @click="addField(field.field)"
      >
        {{ field.name }}
      </v-list-item>
      <v-list-item :disabled="true">FUNCTIONS</v-list-item>
      <v-list-item
        v-for="functionName in Object.keys(tooltips)"
        :key="`function-${functionName}`"
        v-tooltip.html.left="tooltips[functionName]"
        clickable
        @click="addText(`${functionName}()`)"
      >
        {{ `${functionName}()` }}
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import {
  defineComponent,
  toRefs,
  inject,
  ref,
  watch,
  onMounted,
  onUnmounted,
} from "vue";
import tooltipsConfig from "./tooltips";

export default defineComponent({
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: String,
      default: null,
    },
    nullable: {
      type: Boolean,
      default: true,
    },
    collection: {
      type: String,
      default: null,
    },
    depth: {
      type: Number,
      default: undefined,
    },
    placeholder: {
      type: String,
      default: null,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const stores: any = inject("stores");
    const contentEl = ref<HTMLElement | null>(null);

    const menuActive = ref(false);

    const { collection } = toRefs(props);
    const useFieldsStore = stores.useFieldsStore();
    const fields = useFieldsStore
      .getFieldsForCollection(collection.value)
      .filter(
        (e) =>
          e?.type !== "alias" && e?.meta?.interface.search("formula") === -1
      );

    const tooltips = tooltipsConfig;
    const tooltipContent = ref("");
    const tooltipEnable = ref(false);

    watch(() => props.modelValue, setContent, { immediate: true });

    onMounted(() => {
      if (contentEl.value) {
        contentEl.value.addEventListener("selectstart", onSelect);
        setContent();
      }
    });

    onUnmounted(() => {
      if (contentEl.value) {
        contentEl.value.removeEventListener("selectstart", onSelect);
      }
    });

    return {
      menuActive,
      fields,
      tooltips,
      tooltipEnable,
      tooltipContent,
      addField,
      addText,
      onInput,
      contentEl,
      onClick,
      onKeyDown,
    };

    function onInput() {
      if (!contentEl.value) return;

      const valueString = getInputValue();
      emit("update:modelValue", valueString);
    }

    function onClick(event: MouseEvent) {
      const target = event.target as HTMLElement;

      // handle tooltip for function
      handleTooltipFocus(target);

      if (target.tagName.toLowerCase() !== "button") return;

      const field = target.dataset.field;
      emit("update:modelValue", props.modelValue.replace(`{{${field}}}`, ""));

      const before = target.previousElementSibling;
      const after = target.nextElementSibling;

      if (
        !before ||
        !after ||
        !(before instanceof HTMLElement) ||
        !(after instanceof HTMLElement)
      )
        return;

      target.remove();
      joinElements(before, after);
      window.getSelection()?.removeAllRanges();
      onInput();
    }

    function onKeyDown(event: KeyboardEvent) {
      tooltipEnable.value = false;

      if (event.key === "{" || event.key === "}") {
        event.preventDefault();
        menuActive.value = true;
      }

      if (contentEl.value?.innerHTML === "") {
        contentEl.value.innerHTML = '<span class="text"></span>';
      }
    }

    function handleTooltipFocus(target: HTMLElement) {
      const selection = window.getSelection();
      if (selection?.type !== "Caret") return;

      tooltipEnable.value = true;
      const text = target.innerText;

      const offset = selection?.anchorOffset || 0;
      const left = text.substring(0, offset).match(/[A-Z]+$/);
      const right = text.substring(offset, text.length).match(/^[A-Z]+/);
      let result = "";
      result += left ? left.shift() : "";
      result += right ? right.shift() : "";
      tooltipContent.value = tooltips[result] || "";
    }

    function onSelect() {
      if (!contentEl.value) return;
      const selection = window.getSelection();
      if (!selection || selection.rangeCount <= 0) return;
      const range = selection.getRangeAt(0);
      if (!range) return;
      const start = range.startContainer;

      if (
        !(start instanceof HTMLElement && start.classList.contains("text")) &&
        !start.parentElement?.classList.contains("text")
      ) {
        selection.removeAllRanges();
        const range = new Range();
        let textSpan = null;

        for (
          let i = 0;
          i < contentEl.value.childNodes.length || !textSpan;
          i++
        ) {
          const child = contentEl.value.children[i];
          if (child.classList.contains("text")) {
            textSpan = child;
          }
        }

        if (!textSpan) {
          textSpan = document.createElement("span");
          textSpan.classList.add("text");
          contentEl.value.appendChild(textSpan);
        }

        range.setStart(textSpan, 0);
        selection.addRange(range);
      }
    }

    function addField(fieldKey: string) {
      if (!contentEl.value) return;

      const field = fields.find((field) => field.field === fieldKey);

      if (!field) return;

      const button = document.createElement("button");
      button.dataset.field = fieldKey;
      button.setAttribute("contenteditable", "false");
      button.innerText = String(field.name);

      if (window.getSelection()?.rangeCount == 0) {
        const range = document.createRange();
        range.selectNodeContents(contentEl.value.children[0]);
        window.getSelection()?.addRange(range);
      }

      const range = window.getSelection()?.getRangeAt(0);
      if (!range) return;
      range.deleteContents();

      const end = splitElements();

      // modelValue.

      if (end) {
        contentEl.value.insertBefore(button, end);
        window.getSelection()?.removeAllRanges();
      } else {
        contentEl.value.appendChild(button);
        const span = document.createElement("span");
        span.classList.add("text");
        contentEl.value.appendChild(span);
      }

      onInput();
    }

    function addText(value: string) {
      if (!contentEl.value) return;

      const ele = document.createElement("span");
      ele.classList.add("text");
      // ele.setAttribute('contenteditable', 'false');
      ele.innerText = value;

      if (window.getSelection()?.rangeCount == 0) {
        const range = document.createRange();
        range.selectNodeContents(contentEl.value.children[0]);
        window.getSelection()?.addRange(range);
      }

      const range = window.getSelection()?.getRangeAt(0);
      if (!range) return;
      range.deleteContents();

      const end = splitElements();

      if (end) {
        contentEl.value.insertBefore(ele, end);
        window.getSelection()?.removeAllRanges();
      } else {
        contentEl.value.append(ele);
      }

      onInput();
    }

    function joinElements(first: HTMLElement, second: HTMLElement) {
      first.innerText += second.innerText;
      second.remove();
    }

    function splitElements() {
      const range = window.getSelection()?.getRangeAt(0);
      if (!range) return;

      const textNode = range.startContainer;
      if (textNode.nodeType !== Node.TEXT_NODE) return;
      const start = textNode.parentElement;
      if (
        !start ||
        !(start instanceof HTMLSpanElement) ||
        !start.classList.contains("text")
      )
        return;

      const startOffset = range.startOffset;

      const left = start.textContent?.substr(0, startOffset) || "";
      const right = start.textContent?.substr(startOffset) || "";

      start.innerText = left;

      const nextSpan = document.createElement("span");
      nextSpan.classList.add("text");
      nextSpan.innerText = right;
      contentEl.value?.insertBefore(nextSpan, start.nextSibling);
      return nextSpan;
    }

    function getInputValue() {
      if (!contentEl.value) return null;

      const value = Array.from(contentEl.value.childNodes).reduce(
        (acc, node) => {
          const el = node as HTMLElement;
          const tag = el.tagName;

          if (tag && tag.toLowerCase() === "button")
            return (acc += `{{${el.dataset.field}}}`);
          else if ("textContent" in el) return (acc += el.textContent);

          return (acc += "");
        },
        ""
      );

      if (props.nullable === true && value === "") {
        return null;
      }

      return value;
    }

    function setContent() {
      if (!contentEl.value) return;

      if (props.modelValue === null || props.modelValue === "") {
        contentEl.value.innerHTML = '<span class="text"></span>';
        return;
      }

      if (props.modelValue !== getInputValue()) {
        const regex = /({{.*?}})/g;

        const newInnerHTML = props.modelValue
          .split(regex)
          .map((part) => {
            if (part.startsWith("{{") === false) {
              return `<span class="text">${part}</span>`;
            }
            const fieldKey = part.replace(/({|})/g, "").trim();
            const field = fields.find((field) => field.field === fieldKey);

            if (!field) return "";

            return `<button contenteditable="false" data-field="${fieldKey}" ${
              props.disabled ? "disabled" : ""
            }>${field.name}</button>`;
          })
          .join("");
        contentEl.value.innerHTML = newInnerHTML;
      }
    }
  },
});
</script>

<style scoped>
.content {
  display: block;
  flex-grow: 1;
  height: 100%;
  padding: var(--input-padding) 0;
  overflow: hidden;
  font-size: 14px;
  font-family: var(--family-monospace);
  white-space: nowrap;
}

:deep(br) {
  display: none;
}

:deep(span) {
  min-width: 1px;
  min-height: 1em;
}

:deep(button) {
  margin: -1px 4px 0;
  padding: 2px 4px 0;
  color: var(--primary);
  background-color: var(--primary-alt);
  border-radius: var(--border-radius);
  transition: var(--fast) var(--transition);
  transition-property: background-color, color;
  user-select: none;
}

:deep(button:not(:disabled):hover) {
  color: var(--white);
  background-color: var(--danger);
}

.placeholder {
  position: absolute;
  top: 50%;
  left: 14px;
  color: var(--foreground-subdued);
  transform: translateY(-50%);
  user-select: none;
  pointer-events: none;
}

.content > :deep(*) {
  display: inline-block;
  white-space: nowrap;
}

.tooltip {
  position: absolute;
  top: 65px;
  bottom: auto;
  display: block;
  z-index: 3;
}
</style>
