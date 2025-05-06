pragma circom 2.0.0;

template FileUploader() {
  signal input in[256];
  signal output out[256];

  for(var i = 0; i < 256; i++) {
    out[i] <== in[i];
  }
}

component main = FileUploader();