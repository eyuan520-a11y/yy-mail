import orm from '../entity/orm';
import group from '../entity/group';
import email from '../entity/email';
import { desc, eq, like, inArray } from 'drizzle-orm';
import BizError from '../error/biz-error';
import { t } from '../i18n/i18n.js';

const groupService = {

	async list(c, params) {
		let { name } = params;
		let query = orm(c).select().from(group);
		if (name) {
			query = query.where(like(group.name, `${name}%`));
		}
		return await query.orderBy(desc(group.groupId)).all();
	},

	async add(c, params) {
		let { name, color } = params;

		if (!name) {
			throw new BizError(t('emptyGroupName'));
		}

		await orm(c).insert(group).values({ name, color: color || '' }).run();
	},

	async update(c, params) {
		let { groupId, name, color } = params;

		groupId = Number(groupId);

		if (!groupId) {
			throw new BizError(t('invalidGroup'));
		}

		if (!name) {
			throw new BizError(t('emptyGroupName'));
		}

		await orm(c).update(group).set({ name, color: color || '' }).where(eq(group.groupId, groupId)).run();
	},

	async delete(c, params) {
		let { groupIds } = params;
		const idList = String(groupIds).split(',').map(id => Number(id)).filter(Boolean);
		if (idList.length === 0) {
			return;
		}
		await orm(c).delete(group).where(inArray(group.groupId, idList)).run();
		// 取消被删除分组的邮件关联
		await orm(c).update(email).set({ groupId: 0 }).where(inArray(email.groupId, idList)).run();
	}
};

export default groupService;
