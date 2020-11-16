enum JwtTokenVerificationError {
  INVALID_TOKEN_ITSELF = 'INVALID_TOKEN_ITSELF',
  INVALID_TOKEN_PAYLOAD = 'INVALID_TOKEN_PAYLOAD',
  TOKEN_HAS_BEEN_REVOKED = 'TOKEN_HAS_BEEN_REVOKED',
}

export default JwtTokenVerificationError;
