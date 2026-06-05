# My Lab Notes

Fill this file in as you work through the lab. Be honest and specific. This file is part of what you hand in.

## What I think is wrong

Write your first impressions here, before asking anyone or any AI for help. Describe what you saw in the browser, in the Console, and in the Network tab. Write down your theory about what is causing each problem.

Problem 1:

Reproduced: Clicking a user opens the detail panel but the Network tab shows repeated
requests to `/posts?userId=<id>` (the same request keeps firing). The UI for the
panel becomes stuck and the Network tab never settles for that resource.

Theory: The effect that fetches posts depends on a value that it updates (`posts`),
so every fetch updates `posts` which re-triggers the effect — an unintended loop.

Problem 2:

Reproduced: Clicking the "Add to favorites" button updates the underlying data but
the card text/visual state does not update immediately. The UI only shows the
change after another re-render (for example, selecting another user and coming
back).

Theory: The favorites handler mutates the `users` array/object in place and then
calls `setUsers(users)` with the same array reference. React does not detect a
change when the reference is identical, so it doesn't re-render. The handler must
produce a new array/object reference when updating state.

## What did I ask the AI

I asked an AI assistant to read the `README.md`, inspect the code in
`app/page.js`, `app/components/` and `app/lib/`, and fix the two bugs described
in the lab instructions.

## What was the solution

For each problem, explain what the actual cause was, which file and which lines you changed, and why your change fixes it.

Problem 1:

Cause: The posts-fetching effect in `app/components/UserDetail.js` listed `posts`
in its dependency array causing the effect to re-run whenever `posts` was set.

Change: Removed `posts` from the dependency list so the effect only depends on
`userId`.

Files changed:
- `app/components/UserDetail.js` — changed the `useEffect` dependency array from
	`[userId, posts]` to `[userId]`.

Why it fixes it: The effect now runs only when `userId` changes, so the fetch runs
once per selection and stops. Updating `posts` no longer retriggers the effect.

Problem 2:

Cause: The favorite toggle mutated the existing `users` array/object and called
`setUsers(users)`, so React couldn't detect a new value.

Change: Make `handleToggleFavorite` return a new array/object reference by mapping
over the previous users and toggling the `favorite` property for the matching user.

Files changed:
- `app/components/UsersExplorer.js` — updated `handleToggleFavorite` to:
	`setUsers(prev => prev.map(u => u.id === userId ? { ...u, favorite: !u.favorite } : u))`

Why it fixes it: Producing a new array with a new object for the updated user
creates a new reference that React notices, which triggers a re-render and updates
the UI immediately.

## Verification

Steps I used to verify the fixes locally:

1. Start dev server: `npm run dev`
2. Open `http://localhost:3000` and open DevTools (Network + Console).
3. Click a user: confirm only one `GET /posts?userId=<id>` request fires.
4. Click the favorite button: confirm the card updates immediately.

Both issues are now resolved with minimal, targeted changes.
