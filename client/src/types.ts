export type Id = string | number;

export type ColumnType = {
    id: Id;
    title: string;
};

export type TaskType = {
    id: Id;
    columnId: Id;
    title: string;
    content: string;
    html_url: string;
    created_at: string;
    commentsCount: number;
    owner: {
        login: string,
        html_url: string,
    },
    assignee: string,
    state: string,
    number: number,
    pull_request: string,
    user: {
        login: string,
        html_url: string,
    },
    comments: number,
};

export type RepoDetailsType = {
    id: number,
    name: string,
    stargazers_count: number,
    html_url: string,
    organization: {
        html_url: string
        login: string,
    },
    issues: TaskType[]
}