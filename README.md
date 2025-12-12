# Open-Shelf

**Open-Shelf** is a prototype for crowdsourced grocery price transparency.  
Users can upload receipt photos from their phones; a FastAPI backend receives the files (OCR/analysis coming soon).
The goal is to build transparency on how prices changes.

> **Status:** actively under development — features, routes, and UI may change.


### Technical specs

- **Backend:** FastAPI with SQLAlchemy models for stores, receipts, and grocery items.
- **AI parsing:** Receipt images are sent to OpenAI `gpt-4.1-mini` via the `server/services/openai_receipt_parser.py` helper. The model is instructed to return strict JSON with store info, purchase date, and items. 
- **Data model:**
  - `stores`: store name + location.
  - `receipts`: receipt metadata (external UUID, purchase date) and FK to a store.
  - `grocery_items`: individual line items with price/currency and FKs to receipt and store.
- **Key API routes:**
  - `POST /upload-receipt` — validate & save image locally, parse via OpenAI, and return `{receipt_id, parsed_receipt, saved_filename}`.
  - `POST /confirm-receipt` — persists store/receipt/items from the parsed payload (or user edits) into the database.
  - `GET /front_stats/stats` — lightweight dashboard totals (receipts, stores, locations, distinct items).

### How the flow works

1. **Upload:** The React client asks the user to pick or snap a receipt photo and sends it to `POST /upload-receipt`.
2. **Parse:** The backend saves the file under `uploaded_receipts/{uuid}.ext`, then calls OpenAI to extract store/date/items. The response includes a `receipt_id` UUID to correlate later.
3. **Confirm:** The client lets the user review/edit the parsed fields and sends them to `POST /confirm-receipt` with the `receipt_id`. The API upserts the store and receipt, then inserts grocery items tied to those records.
4. **Stats:** Aggregate counts are exposed at `GET /front_stats/stats` for quick UI dashboards.
5. **Storage & config:**  the app connects to cloud PostgreSQL instead