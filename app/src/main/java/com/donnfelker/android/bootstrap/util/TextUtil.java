package com.donnfelker.android.bootstrap.util;

import android.text.Spannable;
import android.text.SpannableString;
import android.text.SpannableStringBuilder;
import android.text.method.LinkMovementMethod;
import android.text.style.ClickableSpan;
import android.text.style.ForegroundColorSpan;
import android.view.View;
import android.widget.TextView;

/**
 * Created by sarpe on 21/11/2013.
 */
public class TextUtil {

    public interface OnLinkClickedListener {
        void onLinkClicked();
    }

    public static void addLink(final TextView textView, String linkText, final String allText,
                               final OnLinkClickedListener listener) {
        SpannableStringBuilder stringBuilder = new SpannableStringBuilder(allText);
        ClickableSpan customSpannable = new ClickableSpan() {

            @Override
            public void onClick(View widget) {
                // Added a tag to notify the view click listener that this click
                // method has been reached.
                widget.setTag("");

                if (listener != null) {
                    listener.onLinkClicked();
                }
            }
        };

        int startIndex = allText.indexOf(linkText);
        int endIndex = startIndex + linkText.length();

        stringBuilder.setSpan(customSpannable, startIndex, endIndex, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
        stringBuilder.append(' ');

        textView.setText(stringBuilder, TextView.BufferType.SPANNABLE);
        textView.setMovementMethod(LinkMovementMethod.getInstance());
    }

    public static void colourText(TextView textView, int colour, String fullText, String textToColour) {
        int startIndex = fullText.indexOf(textToColour);
        int endIndex = startIndex + textToColour.length();

        Spannable span = new SpannableString(fullText);
        span.setSpan(new ForegroundColorSpan(colour), startIndex, endIndex, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
        textView.setText(span);
    }
}
