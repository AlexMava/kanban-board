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
    url: string;
    created_at: string;
    commentsCount: number;
    owner: {
        login: string,
        homepage: string,
    }
};

export type RepoDetailsType = {
    id: number,
    name: string,
    stargazers_count: number,
    html_url: string,
    organization: {
        url: string,
        login: string,
    },
    issues: TaskType[]
}