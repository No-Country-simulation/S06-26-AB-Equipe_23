package br.com.appbit.appbit.config;

import org.junit.jupiter.api.Test;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import static org.junit.jupiter.api.Assertions.assertEquals;

class DataSourceRoutingTest {

    @Test
    void determineCurrentLookupKeyShouldReturnReplicaWhenReadOnly() {
        RoutingDataSource routing = new RoutingDataSource();

        TransactionSynchronizationManager.setCurrentTransactionReadOnly(true);
        try {
            Object key = routing.determineCurrentLookupKey();
            assertEquals(DataSourceType.REPLICA, key);
        } finally {
            TransactionSynchronizationManager.clear();
        }
    }

    @Test
    void determineCurrentLookupKeyShouldReturnPrimaryWhenNotReadOnly() {
        RoutingDataSource routing = new RoutingDataSource();

        Object key = routing.determineCurrentLookupKey();
        assertEquals(DataSourceType.PRIMARY, key);
    }
}
