package com.propabanda.finance_tracker.util;

public final class Sanitizer {

    private Sanitizer() {
    }

    public static String digitsOnly(String text) {
        return text == null ? null : text.replaceAll("\\D", "");
    }
}
