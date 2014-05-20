#define CIRCUIT_VOLTAGE 5.0
#define ADC_SCALE_MAX 1024.0
#define SAMPLE_COUNT 10
#define SAMPLE_INTERVAL 10
#define TEMP_ADC 0

void setup(){
  Serial.begin(9600);
}

float readTemp(){
  float voltage = analogRead(TEMP_ADC)*CIRCUIT_VOLTAGE/ADC_SCALE_MAX;
  float temp = (voltage - 0.5) / 0.01;
  delay(SAMPLE_INTERVAL);
  return temp;
}


void array_shift_left(float in_array[], int array_size){
  for(int i = 1; i<array_size; i++){
    in_array[i-1] = in_array[i];
  }
}

float array_avg(float in_array[], int array_size){
  float total = 0.0;
  for(int i = 0; i<array_size; i++){
    total += in_array[i];
  }
  return total / ((float)array_size);
}

float getTemp(){
  static float samples[SAMPLE_COUNT];
  static int samples_available = 0;
  if(samples_available == SAMPLE_COUNT){
    array_shift_left(samples, samples_available);
  }
  else{
    samples_available++;
  }
  samples[samples_available-1] = readTemp();
  float temp = array_avg(samples, samples_available);
  return temp;
}

void loop(){
  float temp;
  temp = getTemp();
  Serial.print("temp:");
  Serial.println(temp, DEC);
  delay(500);
}
