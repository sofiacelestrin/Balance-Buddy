# Ideas for how to implement certain features which we haven't discussed how to do yet

## Database Schema

1. users

   • Stores user information and includes a coin balance for tracking rewards.

Columns:

    •	id: UUID, Primary Key
    •	full_name: VARCHAR, User’s full name
    •	created_at: TIMESTAMP, User creation date
    •	coins: INT, Current coin balance (starting at 0)

2. tasks

   • Stores tasks created by users, tracking task details, category, and completion status.

Columns:

    •	id: UUID, Primary Key
    •	user_id: UUID, Foreign Key referencing users.id
    •	name: VARCHAR, Task title
    •	due_date: DATE, Task due date
    •	category: ENUM(health, self_actualization, happiness, social_connection), Category associated with the task
    •	priority: INT (1–5), Task priority level
    •	complexity: INT (1–5), Complexity level affecting both energy cost and well-being impact
    •	is_completed: BOOLEAN, Whether the task is completed
    •	created_at: TIMESTAMP, Task creation date

3. meters

   • Tracks the user’s well-being levels and daily energy level.

Columns:

    •	id: UUID, Primary Key
    •	user_id: UUID, Foreign Key referencing users.id
    •	health: INT (default 50), Health meter level
    •	self_actualization: INT (default 50), Self-actualization meter level
    •	happiness: INT (default 50), Happiness meter level
    •	social_connection: INT (default 50), Social connection meter level
    •	energy: INT (default daily max of 20), Energy level that resets daily

4. journal_entries

   • Stores daily reflections, allowing one entry per day.

Columns:

    •	id: UUID, Primary Key
    •	user_id: UUID, Foreign Key referencing users.id
    •	entry_date: DATE, Entry’s date (ensures one entry per day)
    •	content: TEXT, Journal entry content

5. avatar_customizations

   • Tracks the user’s current avatar state and keeps a record of purchased customizations.

Columns:

    •	id: UUID, Primary Key
    •	user_id: UUID, Foreign Key referencing users.id
    •	background_color: VARCHAR, Current background color
    •	earrings: VARCHAR, Current earrings type
    •	eyebrows: VARCHAR, Current eyebrows type
    •	eyes: VARCHAR, Current eyes type
    •	glasses: VARCHAR, Current glasses type
    •	hair: VARCHAR, Current hair type
    •	hair_color: VARCHAR, Current hair color
    •	mouth: VARCHAR, Current mouth type
    •	skin_color: VARCHAR, Current skin color

6. shop_items

   • Defines available customization options for the avatar, which users can purchase.

Columns:

    •	id: UUID, Primary Key
    •	type: ENUM(background, earrings, eyebrows, eyes, glasses, hair, hair_color, mouth, skin_color), Item type
    •	name: VARCHAR, Name of the item (e.g., “blue background”, “round glasses”)
    •	price: INT, Cost in coins

7. purchased_items

   • Logs items purchased by each user, enabling tracking of items available for avatar customization.

Columns:

    •	id: UUID, Primary Key
    •	user_id: UUID, Foreign Key referencing users.id
    •	shop_item_id: UUID, Foreign Key referencing shop_items.id
    •	purchased_at: TIMESTAMP, Date of purchase

## Coin Reward System Proposal

Here’s a simpler, rule-based system for earning coins based on task complexity, completion, and overall balance:

1. Task Completion Rewards: Users earn coins when they complete tasks, with coin rewards based on task complexity.

- Coin Reward Formula: coins earned = complexity \* 2
  For example, completing a complexity 3 task rewards 3 \* 2 = 6 coins.

2. Balance-based Bonuses: If all well-being meters (health, self-actualization, happiness, social connection) are within 10% of each other (indicating good balance), users receive a bonus multiplier on task completion rewards.

   - Balanced Task Bonus: Multiply the base coin reward by 1.5 if the player’s meters are balanced.

3. Penalty for Imbalance: When a user completes a task with one or more meters significantly lower than others (20% or more difference), the coin reward decreases by half. This incentivizes balancing neglected areas before continuing.

This system rewards task completion based on effort while promoting well-being balance.
