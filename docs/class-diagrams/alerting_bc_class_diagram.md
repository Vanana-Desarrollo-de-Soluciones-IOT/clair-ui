```mermaid
---
title: Alerting Bounded Context - Class Diagram
---

classDiagram

namespace interfaces {
    class AlertsPageComponent {
        +onInit()
    }
    class AlertTransform {
        <<service>>
        +alertResourceToDomain(resource)
    }
    class AlertingContextFacade {
        <<interface>>
        +getAlertsByDevice(deviceId)
    }
    class AlertCardComponent {
        +alert: Alert
    }
    class AlertTableComponent {
        +alerts: Alert[]
    }
}

namespace application {
    class AlertQueryServiceImpl {
        +handleGetAlerts(query)
        +handleGetAlertDailySummary(query)
    }
    class AlertingContextFacadeImpl {
        +getAlertsByDevice(deviceId)
    }
}

namespace domain {
    class Alert {
        +id: AlertId
        +severity: AlertSeverity
        +status: AlertStatus
        +message: string
        +timestamp: string
    }
    class AlertQueryService {
        <<interface>>
        +handleGetAlerts(query)
        +handleGetAlertDailySummary(query)
    }
    class AlertGateway {
        <<interface>>
        +getAlerts(query)
        +getAlertDailySummary(query)
    }
    class GetAlertsQuery {
        +page: number
        +size: number
    }
    class AlertSeverity {
        <<enumeration>>
        LOW
        MEDIUM
        HIGH
        CRITICAL
    }
}

namespace infrastructure {
    class AlertHttpGateway {
        +getAlerts(query)
        +getAlertDailySummary(query)
    }
    class AlertResponseResource {
        +id: string
        +severity: string
        +status: string
    }
}

%% Relationships
AlertsPageComponent --> AlertQueryService : uses
AlertCardComponent --> Alert : uses
AlertTableComponent --> Alert : uses

AlertQueryServiceImpl ..|> AlertQueryService : implements
AlertingContextFacadeImpl ..|> AlertingContextFacade : implements

AlertQueryServiceImpl --> AlertGateway : uses
AlertQueryServiceImpl --> AlertTransform : uses

AlertHttpGateway ..|> AlertGateway : implements
AlertHttpGateway --> AlertResponseResource : maps

AlertTransform --> Alert : maps to
AlertTransform --> AlertResponseResource : maps from

AlertQueryServiceImpl --> GetAlertsQuery : receives
```
