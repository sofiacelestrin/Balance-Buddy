## customization_options

- Purpose: This table defines the customization options for user avatars, including attributes such as accessories, clothing, and colors.
- Schema:
  - category: Type of customization (e.g., “accessories”, “clothesColor”).
  - id: Unique identifier for each customization option.
  - option_value: Description of the option (e.g., “red hat”).
  - price: The cost of this option.
- Relationships: None directly, but it is referenced in user_customization_ownership.

## journal_entries

- Purpose: Stores user journal entries, providing a record of user notes or reflections by date.
- Schema:
  - content: Text content of the journal entry.
  - entry_date: Date the entry was created.
  - id: Unique identifier for each entry.
  - user_id: ID of the user who created the entry.
- Relationships: Linked to the users table via user_id, indicating that each entry belongs to a specific user.

## meters

- Purpose: Tracks various well-being metrics for each user, such as energy, health, and happiness levels.
- Schema:
  - energy, happiness, health, self_actualization, social_connection: Integer fields representing the user’s status in different areas.
  - id: Unique identifier for each meter entry.
  - user_id: ID of the user to whom this data belongs.
- Relationships:
  - Linked to the users table via user_id, indicating that each meter entry belongs to a specific user.

## tasks

- Purpose: Manages tasks for users, including task details, priority, due date, and status.
- Schema:
  - category: Category of the task (e.g., “health”, “happiness”).
  - complexity: Difficulty or complexity level of the task.
  - created_at: Date when the task was created.
  - due_date: Deadline for task completion.
  - id: Unique identifier for each task.
  - is_completed: Boolean indicating task completion status.
  - name: Name of the task.
  - priority: Priority level of the task.
  - user_id: ID of the user who owns the task.
- Relationships:
  - Linked to the users table via user_id, indicating that each task is assigned to a specific user.

## user_customization_ownership

- Purpose: Stores the customization items that a user owns, tracking active or inactive status for each customization.
- Schema:
  - customization_id: ID referencing a customization option from customization_options.
  - is_active: Boolean indicating if this customization is currently active for the user.
  - user_id: ID of the user who owns this customization.
- Relationships:
  - Linked to customization_options by customization_id, showing which customizations are available.
  - Linked to users by user_id, indicating the ownership of these customizations by each user.

## users

- Purpose: Main table for user information, containing basic details such as name, avatar name, and balance.
- Schema:
  - avatar_name: Name of the user’s avatar.
  - coin_balance: Numeric field representing the user’s balance or currency within the app.
  - full_name: User’s full name.
  - id: Unique identifier for each user.
- Relationships:
  - Serves as a reference for multiple tables (journal_entries, meters, tasks, and user_customization_ownership), indicating user ownership of entries, tasks, customizations, and meter readings.

Enums: Not a table

- avatar_customization_categories: Enum defining possible categories for avatar customization (e.g., “accessories”, “backgroundColor”).
- category: Enum representing task categories (e.g., “health”, “happiness”).
