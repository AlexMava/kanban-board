export type Id = string | number;
export type textType = string | null;

export type ColumnType = {
    id: Id;
    title: string;
};

export type TaskType = {
    id: Id;
    columnId: Id;
    title: string;
    content: string;
    created_at: string;
    commentsCount: number;
    owner: {
        login: string,
        homepage: string,
    }
};