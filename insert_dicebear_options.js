import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://zhxpkllnffnfgmewqrda.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpoeHBrbGxuZmZuZmdtZXdxcmRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkyMzc2ODQsImV4cCI6MjA0NDgxMzY4NH0.MNKVY3HA1NXfvyRH4C8gA-XAiecfo5d_xwBp7HPNNHw";

const supabase = createClient(supabaseUrl, supabaseKey);

// Load JSON data from file
const optionsData = JSON.parse(fs.readFileSync('dicebear_avataaars_options.json', 'utf8'));

// Function to insert options into Supabase
async function insertOptions() {
  for (const [category, options] of Object.entries(optionsData)) {
    // Determine valid options for this category
    const values = options.enum || options.default || [];
    
    for (const optionValue of values) {
      const { data, error } = await supabase
        .from('customization_options')
        .insert([
          {
            category: category,        // e.g., "backgroundType"
            option_value: optionValue, // e.g., "solid" or "gradientLinear"
            price: 10                  // Fixed price
          }
        ]);

      if (error) {
        console.error(`Error inserting data for ${category} - ${optionValue}:`, error);
      } else {
        console.log('Inserted:', data);
      }
    }
  }
}

// Run the insertion function
insertOptions().then(() => {
  console.log('All options inserted successfully.');
}).catch(error => {
  console.error('Error during insertion:', error);
});
