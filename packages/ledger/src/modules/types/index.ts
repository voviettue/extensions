export interface Doc {
	doc_id: string;
	item_id: string;
	collection: string;
}

export interface Collection {
	id: number;
	collection: string;
	fields: string[];
}
