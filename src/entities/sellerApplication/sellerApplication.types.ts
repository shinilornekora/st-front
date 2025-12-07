export type SellerApplicationStatus =
	| 'NEW'
	| 'APPROVED'
	| 'PENDING'
	| 'REJECTED';
export interface SellerApplication {
	id: number;
	userId: number;
	status: SellerApplicationStatus;
	createdAt: string;
	message?: string;
}
