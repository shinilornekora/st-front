export type UserRole = 'CUSTOMER' | 'SELLER' | 'ADMIN';
export type UserRoleSpecificFields =
	| UserSpecificFields
	| SellerSpecificFields
	| AdminSpecificFields;
export interface User {
	id: number;
	role: UserRole;
	email: string;
	fullName: string;
	phone: string;
	specificFields: UserRoleSpecificFields;
}
export interface UserSpecificFields {
	favoriteProducts?: number[];
}
export interface AdminSpecificFields {
	isRestrictedAdmin: boolean;
	visibleSellers?: string[];
}
export interface SellerSpecificFields {
	id: number;
	userId: number;
	name: string;
	logo?: string;
	phone: string;
	email: string;
	inn?: string;
	billingAccount?: string;
	extraFields?: string[];
}
