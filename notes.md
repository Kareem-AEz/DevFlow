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

---

# PaginatedSearchParams Schema

## What is it?

Zod validation schema for pagination and search parameters.

## Schema definition

**File**: `src/lib/validations.ts`

```typescript
{
  page: number (default: 1),
  pageSize: number (default: 10), 
  query: string (optional),
  filter: string (optional),
  sortBy: string (optional)
}
```

## Where we use it

- `src/lib/actions/question.action.ts` - getQuestions()
- `src/lib/actions/tag.action.ts` - getTags()

## How it works

1. Validates incoming search/pagination params
2. Provides defaults (page: 1, pageSize: 10)
3. Used in server actions for consistent API
4. Calculates skip/limit for database queries

---

# useTransition Hook

## What is it?

React concurrent feature for non-blocking async operations.

## Where we use it

**Files**: 
- `src/components/layout/forms/QuestionForm.tsx`
- `src/components/layout/forms/AnswerForm.tsx`

## How it works

```typescript
const [isPending, startTransition] = useTransition();

// Wrap async operations
startTransition(async () => {
  const result = await serverAction();
  // Handle result
});
```

## Why we use it

- **UI stays responsive** during form submissions
- **No blocking** when server actions run
- **Built-in pending state** for loading indicators
- **Better UX** than traditional async/await
