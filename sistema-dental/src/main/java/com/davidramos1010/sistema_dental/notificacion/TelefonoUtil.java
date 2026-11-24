package com.davidramos1010.sistema_dental.notificacion;

public final class TelefonoUtil {

    private TelefonoUtil() {
    }
    public static String paraSms(String telefono) {
        if (telefono.startsWith("+521") && telefono.length() == 14) {
            return "+52" + telefono.substring(4);
        }
        return telefono;
    }

    public static String paraWhatsapp(String telefono) {
        return telefono;
    }
}