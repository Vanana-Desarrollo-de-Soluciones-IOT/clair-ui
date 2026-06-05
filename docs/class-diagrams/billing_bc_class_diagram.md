# Unified Class

```mermaid
---
title: Billing Bounded Context - Class Diagram
---

classDiagram

namespace interfaces {
    class SelectPlanComponent {
        +onSelectPlan(plan)
    }
    class PremiumCheckoutComponent {
        +onConfirmPayment()
    }
    class PaymentModalComponent {
        +open()
    }
    class BillingTransform {
        <<service>>
        +paymentIntentToDomain(resource)
    }
}

namespace application {
    class BillingCommandServiceImpl {
        +handleCreateSubscriptionPaymentIntent(command)
    }
    class BillingQueryServiceImpl {
        +handleGetUserPlan(query)
        +handleGetStripePublicKey(query)
    }
}

namespace domain {
    class UserPlan {
        +userId: UserId
        +planType: PlanType
    }
    class PaymentIntent {
        +clientSecret: string
    }
    class BillingCommandService {
        <<interface>>
        +handleCreateSubscriptionPaymentIntent(command)
    }
    class BillingQueryService {
        <<interface>>
        +handleGetUserPlan(query)
        +handleGetStripePublicKey(query)
    }
    class BillingGateway {
        <<interface>>
        +getUserPlan(userId)
        +getStripePublicKey()
        +createPaymentIntent(resource)
    }
    class PlanType {
        <<enumeration>>
        FREE
        PREMIUM
    }
}

namespace infrastructure {
    class BillingHttpGateway {
        +getUserPlan(userId)
        +getStripePublicKey()
        +createPaymentIntent(resource)
    }
    class PaymentIntentResource {
        +client_secret: string
    }
}

%% Relationships
SelectPlanComponent --> BillingQueryService : uses
PremiumCheckoutComponent --> BillingCommandService : uses
PremiumCheckoutComponent --> PaymentModalComponent : uses

BillingCommandServiceImpl ..|> BillingCommandService : implements
BillingQueryServiceImpl ..|> BillingQueryService : implements

BillingCommandServiceImpl --> BillingGateway : uses
BillingQueryServiceImpl --> BillingGateway : uses

BillingHttpGateway ..|> BillingGateway : implements
BillingHttpGateway --> PaymentIntentResource : maps

BillingTransform --> PaymentIntent : maps to
BillingTransform --> PaymentIntentResource : maps from
```

---

# Layers

## Interfaces - Billing

```mermaid
---
title: Interfaces - Billing
---
classDiagram
namespace interfaces {
    class SelectPlanComponent {
        +onSelectPlan(plan)
    }
    class PremiumCheckoutComponent {
        +onConfirmPayment()
    }
    class PaymentModalComponent {
        +open()
    }
    class BillingTransform {
        <<service>>
        +paymentIntentToDomain(resource)
    }
}

%% External classes referenced
class BillingQueryService
class BillingCommandService
class PaymentIntent
class PaymentIntentResource

SelectPlanComponent --> BillingQueryService : uses
PremiumCheckoutComponent --> BillingCommandService : uses
PremiumCheckoutComponent --> PaymentModalComponent : uses
BillingTransform --> PaymentIntent : maps to
BillingTransform --> PaymentIntentResource : maps from
```

## Application - Billing

```mermaid
---
title: Application - Billing
---
classDiagram
namespace application {
    class BillingCommandServiceImpl {
        +handleCreateSubscriptionPaymentIntent(command)
    }
    class BillingQueryServiceImpl {
        +handleGetUserPlan(query)
        +handleGetStripePublicKey(query)
    }
}

%% External classes referenced
class BillingCommandService
class BillingQueryService
class BillingGateway

BillingCommandServiceImpl ..|> BillingCommandService : implements
BillingQueryServiceImpl ..|> BillingQueryService : implements
BillingCommandServiceImpl --> BillingGateway : uses
BillingQueryServiceImpl --> BillingGateway : uses
```

## Domain - Billing

```mermaid
---
title: Domain - Billing
---
classDiagram
namespace domain {
    class UserPlan {
        +userId: UserId
        +planType: PlanType
    }
    class PaymentIntent {
        +clientSecret: string
    }
    class BillingCommandService {
        <<interface>>
        +handleCreateSubscriptionPaymentIntent(command)
    }
    class BillingQueryService {
        <<interface>>
        +handleGetUserPlan(query)
        +handleGetStripePublicKey(query)
    }
    class BillingGateway {
        <<interface>>
        +getUserPlan(userId)
        +getStripePublicKey()
        +createPaymentIntent(resource)
    }
    class PlanType {
        <<enumeration>>
        FREE
        PREMIUM
    }
}
```

## Infrastructure - Billing

```mermaid
---
title: Infrastructure - Billing
---
classDiagram
namespace infrastructure {
    class BillingHttpGateway {
        +getUserPlan(userId)
        +getStripePublicKey()
        +createPaymentIntent(resource)
    }
    class PaymentIntentResource {
        +client_secret: string
    }
}

%% External classes referenced
class BillingGateway

BillingHttpGateway ..|> BillingGateway : implements
BillingHttpGateway --> PaymentIntentResource : maps
```
