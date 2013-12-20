package com.donnfelker.android.bootstrap.util;

import android.content.Context;
import android.graphics.Typeface;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

/**
 * Created by sarpe on 21/11/2013.
 */
public class FontManager {
    private Typeface regularFont;
    private Typeface boldFont;

    public FontManager(Context context) {
        regularFont = Typeface.createFromAsset(context.getResources().getAssets(), "font/font_regular.ttf");
        boldFont = Typeface.createFromAsset(context.getResources().getAssets(), "font/font_bold.ttf");
    }

    public Typeface getFont() {
        return regularFont;
    }

    public Typeface getBoldFont() {
        return boldFont;
    }

    public void setFont(View view) {
        if (view instanceof ViewGroup) {
            ViewGroup group = (ViewGroup) view;
            final int totalChildren = group.getChildCount();

            for (int i = 0; i < totalChildren; i++) {
                View childView = group.getChildAt(i);
                setFont(childView);
            }
        } else if (view instanceof TextView) {
            TextView textView = (TextView) view;
            Typeface typeface = textView.getTypeface();

            if (typeface != null && typeface.isBold()) {
                textView.setTypeface(boldFont);
                textView.setTypeface(boldFont, Typeface.BOLD);
            } else {
                textView.setTypeface(regularFont);
            }
        }
    }
}
