package com.donnfelker.android.bootstrap.util;

import com.donnfelker.android.bootstrap.developer.DeveloperConstants;
import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

/**
 * Created by sarpe on 21/11/2013.
 */
public class JsonFactory {

    private static ObjectMapper mapper;

    public static synchronized String toJson(Object item) {
        if (item != null) {
            if (mapper == null) {
                mapper = new ObjectMapper();
            }

            try {
                return mapper.writeValueAsString(item);
            } catch (JsonGenerationException e) {
                if (DeveloperConstants.LOGGING_ENABLED) {
                    e.printStackTrace();
                }
            } catch (JsonMappingException e) {
                if (DeveloperConstants.LOGGING_ENABLED) {
                    e.printStackTrace();
                }
            } catch (IOException e) {
                if (DeveloperConstants.LOGGING_ENABLED) {
                    e.printStackTrace();
                }
            } catch (Exception e) {
                if (DeveloperConstants.LOGGING_ENABLED) {
                    e.printStackTrace();
                }
            }
        }

        return null;
    }
}
