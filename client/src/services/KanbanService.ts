export default class KanbanService {
    getResource = async (url: string) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }

    getRepoDetails = async (url: string) => {
        const details = await this.getResource(url),
            issues = await this.getResource(`${url}/issues?state=all&per_page=50`);

        return {...this._transformRepoDetails(details), issues: issues.map(this._transformIssue)}
    }

    getData = async (url: string) => {
        return await this.getResource(url);
    }

    _transformRepoDetails = (repo: any) => {
        return {
            id: repo.id,
            name: repo.name,
            stargazers_count: repo.stargazers_count,
            html_url: repo.html_url,
            organization: {
                url: repo.organization ? repo.organization.html_url : '#',
                login: repo.organization ? repo.organization.login : 'n/a',
            }
        }
    }

    _transformIssue = (issue: any) => {
        let issueState = 'TODO';
        if (issue.assignee && issue.state === 'open') {
            issueState = 'IN_PROGRESS';
        } else if (issue.state === 'closed') {
            issueState = 'DONE';
        }

        const pullRequestLabel: string = issue.pull_request ? ' (pull_request) ' : '';

        return {
            title: issue.title + pullRequestLabel,
            id: `${issue.number}`,
            columnId: issueState,
            content: '',
            url: issue.html_url,
            created_at: issue.created_at,
            owner: {
                login: issue.user ? issue.user?.login : 'n/a',
                homepage: issue.user ? issue.user?.html_url : '#',
            },
            commentsCount: issue.comments || 0

        }
    }
}