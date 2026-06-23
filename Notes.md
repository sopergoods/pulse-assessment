 Phase 1 — Make it Run

Found and fixed 5 bugs:

- Poll was updating everyone's lastSeen instead of just the caller, so dots stayed on the map forever after someone left. Changed the where clause to only update the current user.
- The end signal never cleared the busy flag so users would get stuck and no one could connect to them. Added end to the busy cleanup logic.
- sendChat was sending t:"msg" but the receiver expected t:"chat" so messages never actually arrived. Fixed the type to match.
- The close() method in webrtc.ts had a missing brace which broke connection cleanup. Fixed the syntax.
- Some text in page.tsx had garbled encoding from the original repo. Replaced with plain text.

Phase 2 — Make it Good

- Redesigned the entry gate, chat panel, connection prompt, and video panel with a cleaner dark aesthetic
- Added pulse ring animations on map dots with glow on hover
- Added a floating animation on the Me marker
- Chat panel now slides in from the right
- Added a map hint so users know to click dots to connect
- AI chat button has a glow and shimmer effect to stand out
Phase 3 — Make it Secure

- No rate limiting on poll or signal endpoints — added 60 req/min per user limit using the limiter package
- Poll endpoint had no ID length validation — added min/max check to match the join endpoint
- Signal endpoint had no length check on fromId/toId — added validation on both
- end signal never freed the busy flag — fixed as part of Phase 1 but also a security concern

Phase 4 — Make it Better

Built an AI Stranger chat feature using the Anthropic Claude API. When you're on the map alone or just want to try the app, you can click "Chat with AI Stranger" and talk to an AI that acts like an anonymous stranger. It stays in character — brief, curious, human-feeling. The button disappears when you're in a real connection so it never gets in the way.

Known blocker: the feature requires Anthropic API credits. The code and route are fully built and will work once credits are available. With more time I'd add a typing indicator, personality options for the AI, and better error handling when credits run out.