 # 1
 CREATE TABLE email_otps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,

  otp_hash TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,

  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts <= 5),
  used BOOLEAN NOT NULL DEFAULT FALSE,

  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_email_otps_email_created
ON email_otps (email, created_at DESC);

# 2
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

# 3
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,

  token_hash TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,

  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_token_hash ON sessions(token_hash);
CREATE INDEX idx_sessions_device_id ON sessions(device_id);

# 4
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  device_name TEXT,
  revoked BOOLEAN NOT NULL DEFAULT FALSE,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_seen TIMESTAMP
);
CREATE INDEX idx_devices_user_id ON devices(user_id);
# imp 
Final relationship (VERY IMPORTANT)
users
  └── devices (many)
        └── sessions (many, but per device)


User can have many devices

Each device can have multiple sessions (optional)

Session always knows:

who (user)

from where (device)
# 5
CREATE TABLE identity_keys (
  device_id UUID PRIMARY KEY REFERENCES devices(id) ON DELETE CASCADE,

  public_key TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
# 6 
CREATE TABLE signed_prekeys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,

  public_key TEXT NOT NULL,
  signature TEXT NOT NULL,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_signed_prekeys_device ON signed_prekeys(device_id);
# 7
CREATE TABLE one_time_prekeys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,

  public_key TEXT NOT NULL,
  used BOOLEAN NOT NULL DEFAULT FALSE,

  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ot_prekeys_device_used
ON one_time_prekeys(device_id, used);

