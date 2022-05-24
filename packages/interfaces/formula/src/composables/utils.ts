import format from 'date-fns/format'

const daysInWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'saturday'];

const parseDate = (date: any) => {
  const d = date instanceof Date ? date : new Date(date);

  if (!(d instanceof Date) || isNaN(d.getTime())) {
    throw Error('Invalid date value')
  }

  return date?.length > 10 ? d : new Date(format(d, 'yyyy-MM-dd'))
};

export { daysInWeek, parseDate }