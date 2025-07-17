# React `use()` Hook Notes

## What is it?

React's experimental `use()` hook unwraps promises directly in components.

## Where we use it

**File**: `src/components/layout/votes/Votes.tsx`

```typescript
const { success, data } = use(hasVotedPromise);
```

## How it works

1. Server component creates promise: `hasVotedPromise = hasVoted({...})`
2. Promise passed to client component as prop
3. `use()` unwraps promise, component suspends until resolved
4. Wrapped in `<Suspense>` for loading states

## Why we use it

- **Performance**: Data fetching starts early (no waterfall)
- **Clean code**: No useEffect/loading state boilerplate
- **UX**: Voting buttons appear immediately, state streams in

## Key files

- `src/components/layout/votes/Votes.tsx` - uses the hook
- `src/app/(root)/questions/[id]/page.tsx` - creates promise
- `src/lib/actions/vote.action.ts` - server action

## Important notes

- `use()` is experimental, may change
- Must wrap in `<Suspense>`
- Promise must be stable (same reference)
- Works with `useOptimistic` for optimistic updates
