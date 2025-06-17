export interface ForumUser {
	id: number;
	username: string;
	avatar_template: string;
	admin?: boolean;
	moderator?: boolean;
	trust_level: number;
	primary_group_name?: string;
	flair_name?: string;
	flair_url?: string;
	flair_bg_color?: string;
	flair_color?: string;
	flair_group_id?: number;
}

export interface ForumTopic {
	id: number;
	title: string;
	fancy_title: string;
	slug: string;
	posts_count: number;
	reply_count: number;
	highest_post_number: number;
	image_url: string | null;
	created_at: string;
	last_posted_at: string;
	bumped: boolean;
	bumped_at: string;
	archetype: string;
	unseen: boolean;
	pinned: boolean;
	unpinned: string | null;
	visible: boolean;
	closed: boolean;
	archived: boolean;
	bookmarked: boolean | null;
	liked: boolean | null;
	tags: string[];
	tags_descriptions: Record<string, unknown>;
	views: number;
	like_count: number;
	has_summary: boolean;
	last_poster_username: string;
	category_id: number;
	pinned_globally: boolean;
	featured_link: string | null;
	has_accepted_answer: boolean;
	can_have_answer: boolean;
	posters: Array<{
		extras?: string | null;
		description: string;
		user_id: number;
		primary_group_id?: number | null;
		flair_group_id?: number | null;
	}>;
}

export interface ForumResponse {
	users: ForumUser[];
	primary_groups: Array<{
		id: number;
		name: string;
	}>;
	flair_groups: Array<{
		id: number;
		name: string;
		flair_url: string;
		flair_bg_color: string;
		flair_color: string;
	}>;
	topic_list: {
		can_create_topic: boolean;
		more_topics_url: string;
		per_page: number;
		top_tags: string[];
		topics: ForumTopic[];
	};
}

export interface ProcessedTopic {
	id: number;
	title: string;
	slug: string;
	author: {
		username: string;
		avatar_template: string;
	} | null;
	image_url: string | null;
	created_at: string;
	timeAgo: string;
	tags: string[];
	views: number;
	like_count: number;
	posts_count: number;
	url: string;
	preview?: string;
}

export interface TopicDetailResponse {
	post_stream: {
		posts: Array<{
			id: number;
			post_number: number;
			cooked: string;
			username: string;
			created_at: string;
		}>;
	};
} 