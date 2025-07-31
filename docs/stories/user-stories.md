# User Stories for AI Chat Tool – Beach Wear Store

## Roles

- **Trendy shopper**: Young professional, loves fashion, shops online for the latest beach wear trends.
- **Vacation planner**: Girl plans beach vacations, looks for deals and bundles.
- **Eco-Conscious Shopper**: Values sustainability, seeks eco-friendly products.

### Story 1: Products Information

**As Trendy shopper** I want to see the available beach outfits

- **Acceptance Criteria:**
  - Use AI to generate product descriptions, sizes, colors, and care instructions, prices, discount and arrival date
  - The products should show image suggested by AI
- **Benefit:** Shows available products in the shop
- **Mapped Endpoint:** `GET /api/v1/products`

### Story 2: User registration

**As Trendy shopper** As a shopper i want to register in the shop

- **Acceptance Criteria:**
  - The user should be able to register using username and password
  - The user should confirm the password
  - If passwords do not match an error should be shown to the user
- **Benefit:** Allow the user to get register
- **Mapped Endpoint:** `GET /api/v1/auth/register`

### Story 3: User Login

**As Trendy shopper** As a registered shopper I want to login to the shop

- **Acceptance Criteria:**
  - The user should be able to login using username and password
  - If the login failed then notify the user with an invalid login message
- **Benefit:** Allow the user to get login and get access to AI assistant
- **Mapped Endpoint:** `GET /api/v1/auth/login`

### Story 4: Get Personalized Recommendations

**As Trendy shopper** I want the AI to suggest beach wear based on my preferences so that I find items that match my style.

- **Acceptance Criteria:**
  - AI asks about style, color, and size preferences.
  - AI suggests accesories for the beach.
  - AI suggests sunblock for care your skin in the beach.
  - AI should respond I do not know when the question is not related to recommendations
- **Benefit:** Increases conversion by personalizing the shopping experience.
- **Mapped Endpoint:** `POST /api/v1/chat`

### Story 5: Find Girl Bundles

**As Vacation planner** I want to ask the AI about Girl beach wear bundles so that I can shop efficiently for us.

- **Acceptance Criteria:**
  - AI lists available bundles for women.
  - AI provides bundle information about outfits depend on the places.
  - AI should respond I do not know when the question is not related to promotions
- **Benefit:** Simplifies shopping for families and promotes bundle sales.
- **Mapped Endpoint:** `POST /api/v1/chat`

### Story 6: Search for Sustainable Products

**As Eco-Conscious Shopper** I want to ask the AI for eco-friendly beach wear and accessories so that I can make responsible choices.

- **Acceptance Criteria:**
  - AI filters and lists sustainable products.
  - AI provides details on materials (e.g., organic cotton, recycled PET).
  - AI shows sustainability certifications (e.g., GOTS, FSC, PETA Approved).
  - AI can answer follow-up questions such as: “What makes this item sustainable?”, “Where was this product made?”
  - AI should respond I do not know when the question is not related to Eco-consious questions
- **Benefit:** Builds brand loyalty among eco-conscious customers.
- **Mapped Endpoint:** `GET /api/v1/chat`

### Story 7: Google User Login

**As Trendy shopper** As shopper i want to use google to register for convenience

- **Acceptance Criteria:**
  - The user should be able to login using google account
  - If the login failed then notify the user with an invalid login message
- **Benefit:** Allow the user to get login
- **Mapped Endpoint:** `GET /api/v1/auth/google`

---
