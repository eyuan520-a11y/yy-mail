import { sqliteTable, text, integer} from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
const group = sqliteTable('email_group', {
	groupId: integer('group_id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	color: text('color').notNull().default(''),
	userId: integer('user_id').default(0).notNull(),
	createTime: text('create_time').default(sql`CURRENT_TIMESTAMP`)
});
export default group
