import {
	pgTable,
	integer,
	text,
	timestamp,
	boolean,
	primaryKey,
	pgEnum,
	jsonb,
	date
} from 'drizzle-orm/pg-core';

/*
> This document mirrors; Update this file whenever the TypeScript schema changes!
- src/lib/db/schema.ts.
- src/routes/doc/schema/+page.md
 */

export const equipmentStatusEnum = pgEnum('equipment_status', ['ativo', 'em_manutencao', 'inativo']);

export const equipmentCriticalityEnum = pgEnum('equipment_criticality', ['baixa', 'media', 'alta', 'critica']);

export const locationTypeEnum = pgEnum('location_type', ['matriz', 'filial', 'sala', 'externo']);

export const movementStatusEnum = pgEnum('movement_status', [
	'pendente',
	'aprovado',
	'rejeitado',
	'completado',
	'cancelado'
]);

export const maintenanceTypeEnum = pgEnum('maintenance_type', ['preventiva', 'corretiva', 'calibracao']);

export const auditEventTypeEnum = pgEnum('equipment_audit_event', [
	'cadastro',
	'edicao',
	'movimento',
	'manutencao',
	'status_change'
]);

export const movementPolicyScopeEnum = pgEnum('movement_policy_scope', ['perfil', 'local', 'categoria']);

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	name: text('name'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash')
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const group = pgTable('group', {
	id: text('id').primaryKey().unique(),
	name: text('name')
});

export const relGroup = pgTable(
	'rel_group',
	{
		groupId: text('group_id')
			.notNull()
			.references(() => group.id),
		userId: text('user_id')
			.notNull()
			.references(() => user.id),
		adm: boolean('adm').default(false)
	},
	(table) => ({
		pk: primaryKey({ columns: [table.groupId, table.userId] })
	})
);

export const location = pgTable('location', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	parentId: text('parent_id').references(() => location.id),
	type: locationTypeEnum('type').notNull(),
	timezone: text('timezone'),
	isActive: boolean('is_active').notNull().default(true),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow()
});

export const equipment = pgTable('equipment', {
	id: text('id').primaryKey(),
	assetCode: text('asset_code').notNull().unique(),
	name: text('name').notNull(),
	description: text('description'),
	category: text('category'),
	criticality: equipmentCriticalityEnum('criticality').notNull().default('media'),
	status: equipmentStatusEnum('status').notNull().default('ativo'),
	locationId: text('location_id').references(() => location.id),
	custodianUserId: text('custodian_user_id').references(() => user.id),
	acquisitionDate: date('acquisition_date'),
	depreciationEnd: date('depreciation_end'),
	metadata: jsonb('metadata').$type<Record<string, unknown>>(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow()
});

export const equipmentMovement = pgTable('equipment_movement', {
	id: text('id').primaryKey(),
	equipmentId: text('equipment_id')
		.notNull()
		.references(() => equipment.id),
	requestedByUserId: text('requested_by_user_id')
		.notNull()
		.references(() => user.id),
	authorizedByUserId: text('authorized_by_user_id').references(() => user.id),
	originLocationId: text('origin_location_id').references(() => location.id),
	targetLocationId: text('target_location_id').references(() => location.id),
	status: movementStatusEnum('status').notNull().default('pendente'),
	authorizationNote: text('authorization_note'),
	movementNote: text('movement_note'),
	requestedAt: timestamp('requested_at', { withTimezone: true, mode: 'date' }).defaultNow(),
	authorizedAt: timestamp('authorized_at', { withTimezone: true, mode: 'date' }),
	executedAt: timestamp('executed_at', { withTimezone: true, mode: 'date' }),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow()
});

export const equipmentMaintenance = pgTable('equipment_maintenance', {
	id: text('id').primaryKey(),
	equipmentId: text('equipment_id')
		.notNull()
		.references(() => equipment.id),
	type: maintenanceTypeEnum('type').notNull(),
	scheduledFor: timestamp('scheduled_for', { withTimezone: true, mode: 'date' }),
	startedAt: timestamp('started_at', { withTimezone: true, mode: 'date' }),
	completedAt: timestamp('completed_at', { withTimezone: true, mode: 'date' }),
	technicianUserId: text('technician_user_id').references(() => user.id),
	resultNote: text('result_note'),
	attachments: jsonb('attachments').$type<Array<Record<string, unknown>>>(),
	statusAfter: equipmentStatusEnum('status_after'),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow()
});

export const equipmentAuditLog = pgTable('equipment_audit_log', {
	id: text('id').primaryKey(),
	equipmentId: text('equipment_id')
		.notNull()
		.references(() => equipment.id),
	eventType: auditEventTypeEnum('event_type').notNull(),
	payload: jsonb('payload').$type<Record<string, unknown>>(),
	actorUserId: text('actor_user_id').references(() => user.id),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow()
});

export const movementPolicy = pgTable('movement_policy', {
	id: text('id').primaryKey(),
	scopeType: movementPolicyScopeEnum('scope_type').notNull(),
	roleKey: text('role_key'),
	locationId: text('location_id').references(() => location.id),
	category: text('category'),
	requiresDualApproval: boolean('requires_dual_approval').notNull().default(false),
	approverUserId: text('approver_user_id').references(() => user.id),
	isActive: boolean('is_active').notNull().default(true),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow()
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

export type Group = typeof group.$inferSelect;

export type RelGroup = typeof relGroup.$inferSelect;

export type Location = typeof location.$inferSelect;

export type Equipment = typeof equipment.$inferSelect;

export type EquipmentMovement = typeof equipmentMovement.$inferSelect;

export type EquipmentMaintenance = typeof equipmentMaintenance.$inferSelect;

export type EquipmentAuditLog = typeof equipmentAuditLog.$inferSelect;

export type MovementPolicy = typeof movementPolicy.$inferSelect;
