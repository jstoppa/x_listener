export interface User {
	screen_name: string | undefined;
	friends_count: number | undefined;
	name: string | undefined;
	created_at: Date | undefined;
	followers_count: number | undefined;
	fast_followers_count: number | undefined;
	verified: boolean | undefined;
	is_blue_verified: boolean;
}
