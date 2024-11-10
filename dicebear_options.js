import { schema } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';
import fs from 'fs';

// https://www.dicebear.com/guides/access-all-available-options/
const options = {
  ...schema.properties,
  ...avataaars.schema.properties,
};

console.log(options);

fs.writeFileSync('dicebear_avataaars_options.json', JSON.stringify(options, null, 2), 'utf-8');
console.log("Options saved to dicebear_avataaars_options.json");