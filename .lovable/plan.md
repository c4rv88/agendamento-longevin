

## Problem

The `procedimento_id=77` value works for the `available-schedule` endpoint (GET, returns 200) but is rejected by the `new-appoint` endpoint (POST, returns 422). The Feegow API validates this field differently for appointment creation versus schedule queries.

## Investigation

The logs confirm:
- GET `/api/appoints/available-schedule?...&procedimento_id=77` returns **200 OK**
- POST `/api/appoints/new-appoint` with `procedimento_id: 77` in body returns **422** with `"O campo procedimento id selecionado é inválido"`

This means the procedure ID `77` exists for schedule lookups but is not a valid selection for creating appointments. The Feegow API likely has a separate list of valid procedure IDs for the `new-appoint` endpoint.

## Plan

### 1. Query valid procedure IDs from Feegow API
Use the edge function test tool to call the Feegow procedures list endpoint (`/api/procedures/list`) to discover which `procedimento_id` values are valid for appointment creation. This will tell us the correct value to use.

### 2. Update `src/services/api/appointmentService.ts`
Replace `procedimento_id: 77` with the correct valid value identified from the API response.

### Technical Details
- File to modify: `src/services/api/appointmentService.ts` (line 28)
- The `available-schedule` services can keep `procedimento_id=77` since it works there
- If no valid procedure ID is found via the API, we will try common values like `1`, `0`, or omit the field entirely

