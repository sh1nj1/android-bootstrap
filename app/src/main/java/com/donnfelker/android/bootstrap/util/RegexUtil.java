package com.donnfelker.android.bootstrap.util;

/**
 * Created by sarpe on 21/11/2013.
 */
public class RegexUtil {
    public static boolean isEmailValid(String email) {
        if (email != null) {
            return android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches();
        }

        return false;
    }
}
