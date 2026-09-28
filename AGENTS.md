<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## FR14 UI
- FR14 screens are frontend-only: all data comes from `src/data/fr14.ts` mock records, so the prototype is demonstrable without a backend.
- Shared PVSIS chrome and FR14 layout/status primitives live in `src/components/pvsis/`, keeping every FR14 page visually consistent with the PVSIS portal.
