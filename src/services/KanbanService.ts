export default class KanbanService {
    _apiBace = 'https://api.github.com/repos/facebook/react/issues?per_page=20';

    getResource = async (url: string) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }

    getAllIssues = async () => {
        const res = await this.getResource(`${this._apiBace}`);

        console.log(res)
        return res.map(this._transformIssue);
    }

    _transformIssue = (issue: any) => {
        return {
            title: issue.title,
            id: `${issue.number}`,
            columnId: issue.assignee ? 'IN_PROGRESS' : 'TODO',
            content: '',
            created_at: issue.created_at,
            owner: {
                login: issue.user?.login || '',
                homepage: issue.owner?.html_url || '',
            },
            commentsCount: issue.comments || 0

        }
    }
}