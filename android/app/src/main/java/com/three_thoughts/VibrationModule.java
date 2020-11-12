// VibrationModule.java

package com.three_thoughts;

import android.accessibilityservice.AccessibilityService;
import android.widget.Toast;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;
import java.util.HashMap;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.os.Build;
import android.content.Context;


public class VibrationModule extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext;

  private static final String DURATION_SHORT_KEY = "SHORT";
  private static final String DURATION_LONG_KEY = "LONG";

  VibrationModule(ReactApplicationContext context) {
    super(context);
    reactContext = context;
  }
  @Override
  public String getName() {
    return "AndroidVibration";
  }  
  @ReactMethod
  public void startVibration( int duration, int amplitude) {
      Vibrator v = (Vibrator) reactContext.getSystemService(Context.VIBRATOR_SERVICE);
      if (Build.VERSION.SDK_INT >= 26 ) {
          v.vibrate(VibrationEffect.createOneShot(duration, amplitude));
      } else {
          v.vibrate(duration);
      }    
  }  

  @ReactMethod
  public void cancelVibration() {
    Vibrator v = (Vibrator) reactContext.getSystemService(Context.VIBRATOR_SERVICE);
    v.cancel();
  }  

}