package br.com.appbit.appbit.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.datasource.LazyConnectionDataSourceProxy;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

@Configuration
@Profile("!test")
@Slf4j
public class DataSourceConfig {

    private final Environment env;

    public DataSourceConfig(Environment env) {
        this.env = env;
    }

    @Bean
    @Primary
    public DataSource dataSource() {
        DataSource primaryDS = DataSourceBuilder.create()
                .url(env.getProperty("spring.datasource.primary.jdbc-url"))
                .username(env.getProperty("spring.datasource.primary.username"))
                .password(env.getProperty("spring.datasource.primary.password"))
                .driverClassName(env.getProperty("spring.datasource.primary.driver-class-name"))
                .build();

        String replicaHost = System.getenv("DB_REPLICA_HOST");
        if (replicaHost == null || replicaHost.isBlank()) {
            log.info("Réplica de leitura não configurada (DB_REPLICA_HOST nulo). Usando DataSource primário único.");
            return primaryDS;
        }

        log.info("Réplica de leitura configurada. Ativando roteamento de conexões (Read/Write Splitting).");
        DataSource replicaDS = DataSourceBuilder.create()
                .url(env.getProperty("spring.datasource.replica.jdbc-url"))
                .username(env.getProperty("spring.datasource.replica.username"))
                .password(env.getProperty("spring.datasource.replica.password"))
                .driverClassName(env.getProperty("spring.datasource.replica.driver-class-name"))
                .build();

        RoutingDataSource routing = new RoutingDataSource();
        Map<Object, Object> targetDataSources = new HashMap<>();
        targetDataSources.put(DataSourceType.PRIMARY, primaryDS);
        targetDataSources.put(DataSourceType.REPLICA, replicaDS);
        
        routing.setTargetDataSources(targetDataSources);
        routing.setDefaultTargetDataSource(primaryDS);
        routing.afterPropertiesSet();

        return new LazyConnectionDataSourceProxy(routing);
    }
}
