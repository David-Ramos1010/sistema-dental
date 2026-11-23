package com.davidramos1010.sistema_dental.dto;

public final class PasswordRules {

    private PasswordRules() {
    }

    public static final String REGEX = "^(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$";
    public static final String MENSAJE =
            "Mínimo 8 caracteres, con al menos una mayúscula, un número y un carácter especial";
}