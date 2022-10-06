export type Agreement = {
  "version": "0.1.0",
  "name": "agreement",
  "instructions": [
    {
      "name": "createAgreement",
      "accounts": [
        {
          "name": "agreement",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "CreateAgreementArgs"
          }
        }
      ]
    },
    {
      "name": "signAgreement",
      "accounts": [
        {
          "name": "agreement",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "agreement",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "guarantorCount",
            "type": "u8"
          },
          {
            "name": "guarantors",
            "type": {
              "vec": {
                "defined": "Guarantor"
              }
            }
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "content",
            "type": "string"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "CreateAgreementArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "guarantorCount",
            "type": "u8"
          },
          {
            "name": "guarantors",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "content",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "Guarantor",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "wallet",
            "type": "publicKey"
          },
          {
            "name": "signed",
            "type": "u8"
          },
          {
            "name": "signedAt",
            "type": {
              "option": "i64"
            }
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "GuarantorCountMismatch",
      "msg": "Number of guarantors mismatch!"
    },
    {
      "code": 6001,
      "name": "GuarantorDoesNotExist",
      "msg": "Guarantor does not exist!"
    }
  ]
};

export const IDL: Agreement = {
  "version": "0.1.0",
  "name": "agreement",
  "instructions": [
    {
      "name": "createAgreement",
      "accounts": [
        {
          "name": "agreement",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "CreateAgreementArgs"
          }
        }
      ]
    },
    {
      "name": "signAgreement",
      "accounts": [
        {
          "name": "agreement",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "agreement",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "guarantorCount",
            "type": "u8"
          },
          {
            "name": "guarantors",
            "type": {
              "vec": {
                "defined": "Guarantor"
              }
            }
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "content",
            "type": "string"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "CreateAgreementArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "guarantorCount",
            "type": "u8"
          },
          {
            "name": "guarantors",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "content",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "Guarantor",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "wallet",
            "type": "publicKey"
          },
          {
            "name": "signed",
            "type": "u8"
          },
          {
            "name": "signedAt",
            "type": {
              "option": "i64"
            }
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "GuarantorCountMismatch",
      "msg": "Number of guarantors mismatch!"
    },
    {
      "code": 6001,
      "name": "GuarantorDoesNotExist",
      "msg": "Guarantor does not exist!"
    }
  ]
};
