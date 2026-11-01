const languages = [['en', 'English'], ['de', 'German'], ['fr', 'French'], ['es', 'Spanish']];
const localized = (name, title, multiline = false) => ({
  name, title, type: 'object',
  fields: languages.map(([name, title]) => ({
    name, title, type: multiline ? 'text' : 'string', ...(multiline ? {rows: 5} : {}),
    validation: rule => name === 'en' ? rule.required() : rule,
  })),
});
const photo = {
  type: 'image',
  fields: [{name: 'alt', title: 'Photo description (accessibility)', type: 'localizedText', validation: rule => rule.required()}],
};

export const schemaTypes = [
  localized('localizedText', 'Translated text'),
  localized('localizedBody', 'Translated description', true),
  {
    name: 'welfareProject', title: 'Welfare projects', type: 'document',
    fields: [
      {name: 'title', title: 'Project title', type: 'localizedText', validation: rule => rule.required()},
      {name: 'summary', title: 'Short introduction', type: 'localizedText', validation: rule => rule.required()},
      {name: 'description', title: 'Full description', type: 'localizedBody'},
      {name: 'category', title: 'Category', type: 'string', options: {list: [{title: 'Water / wells', value: 'water'}, {title: 'Children', value: 'children'}, {title: 'Other welfare work', value: 'other'}]}, initialValue: 'other'},
      {name: 'location', title: 'Location', type: 'string'},
      {name: 'status', title: 'Status', type: 'string', options: {list: [{title: 'Planned', value: 'planned'}, {title: 'Ongoing', value: 'ongoing'}, {title: 'Completed', value: 'completed'}]}, initialValue: 'planned'},
      {name: 'cover', title: 'Cover photo', ...photo},
      {name: 'gallery', title: 'Photo gallery', type: 'array', of: [photo]},
      {name: 'order', title: 'Display order (lowest first)', type: 'number', initialValue: 100, validation: rule => rule.integer().min(0)},
    ],
    preview: {select: {title: 'title.en', subtitle: 'location', media: 'cover'}},
  },
];
