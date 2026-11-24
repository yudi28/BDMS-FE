/** GET /api/v1/banks/{id} — response data (BankResponse schema) */
export interface BankResponse {
  id: string
  code: string
  name: string
  status: string
  createdAt: string
  updatedAt: string
}

/** POST /api/v1/banks — request (CreateBankRequest schema) */
export interface CreateBankRequest {
  code: string
  name: string
}

/** PUT /api/v1/banks/{id} — request (UpdateBankRequest schema) */
export interface UpdateBankRequest {
  name?: string
  status?: string
}
