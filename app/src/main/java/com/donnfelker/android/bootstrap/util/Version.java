package com.donnfelker.android.bootstrap.util;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;

/**
 * Created by sarpe on 21/11/2013.
 */
public class Version {
    private static final String TAG = Version.class.getSimpleName();

    public static String getApplicationVersion(Context context) {
        PackageInfo packageInfo;

        try {
            packageInfo = context.getPackageManager().getPackageInfo(context.getPackageName(), 0);
            return packageInfo.versionName;
        } catch (PackageManager.NameNotFoundException e) {

        }

        return null;
    }

    public static boolean isHoneycombMr2OrAbove() {
        return (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.HONEYCOMB_MR2);
    }

    public static boolean isJellybeanOrAbove() {
        return (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.JELLY_BEAN);
    }

//    public static boolean isJellybeanMr1OrAbove() {
//        return (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.JELLY_BEAN_MR1);
//    }

}
