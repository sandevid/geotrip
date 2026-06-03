-- Add explanation columns for economic valuation methods
ALTER TABLE wisata ADD COLUMN IF NOT EXISTS tcm_penjelasan TEXT;
ALTER TABLE wisata ADD COLUMN IF NOT EXISTS cvm_penjelasan TEXT;
ALTER TABLE wisata ADD COLUMN IF NOT EXISTS hpm_penjelasan TEXT;
ALTER TABLE wisata ADD COLUMN IF NOT EXISTS tev_penjelasan TEXT;
