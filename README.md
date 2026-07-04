# task-list

Chewawa is a static GitHub Pages project management demo with sitcom themed work items. The app is served directly from the repository root, so `index.html`, `style.css`, and `script.js` are the production entry points for the published page.

## Development

Run the site locally with any static file server:

```bash
python3 -m http.server 4173
```

Then open <http://127.0.0.1:4173/>.

## Pull request conflict notes

PR branches for this repo should be based on the already merged interface commit (`f25c563`) before adding follow up UI changes. That keeps GitHub from comparing the same large `index.html`, `script.js`, and `style.css` rewrite twice, which was the cause of the PR #2 conflict page.

Before opening or updating a follow up PR, verify the branch only contains the intended follow up changes:

```bash
git log --oneline --decorate --graph --max-count=5
```

You can also smoke check mergeability locally with:

```bash
git merge-tree --write-tree f25c5638b15aca96f17dcb7d9249a231ab6dae31 HEAD
```

If that command exits successfully and prints a tree SHA, Git can merge the branch with the base without conflicts.

## Updating the pull request

This workspace cannot update GitHub by itself unless the current branch has a configured `origin` remote and push credentials. If a PR update does not appear on GitHub, push the current branch explicitly:

```bash
git remote add origin https://github.com/Bhagyashree-Vaidya/task-list.git
git push --force-with-lease origin work
```

If the PR branch has a different name on GitHub, replace `work` with that branch name. After the push finishes, refresh the PR page and confirm the latest commit hash is visible in the Conversation or Commits tab.
