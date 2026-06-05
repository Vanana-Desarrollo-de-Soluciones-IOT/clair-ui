# Unified Class

```mermaid
---
title: Device Bounded Context - Class Diagram
---

classDiagram

namespace interfaces {
    class SpaceDevicesPage {
        +onInit()
        +onClaimDevice()
    }
    class DeviceTransform {
        <<service>>
        +deviceResourceToDomain(resource)
        +deviceToResource(device)
    }
    class DeviceContextFacade {
        <<interface>>
        +getDeviceById(id)
    }
}

namespace application {
    class DeviceCommandServiceImpl {
        +handleCreateOrganization(command)
        +handleClaimDevice(command)
        +handlePairDevice(command)
        +handleQueueDeviceCommand(command)
    }
    class DeviceQueryServiceImpl {
        +handleGetDevicesBySpace(query)
        +handleGetOrganizationById(query)
    }
    class DeviceThresholdCommandServiceImpl {
        +handleCreateThreshold(command)
        +handleUpdateThreshold(command)
    }
    class DeviceThresholdQueryServiceImpl {
        +handleGetThresholdsByDevice(query)
    }
}

namespace domain {
    class Organization {
        +id: OrganizationId
        +name: string
    }
    class Space {
        +id: SpaceId
        +name: string
    }
    class Device {
        +id: DeviceId
        +serialNumber: string
        +status: DeviceStatus
        +hardwareId: HardwareId
    }
    class DeviceCommandService {
        <<interface>>
        +handleClaimDevice(command)
        +handlePairDevice(command)
    }
    class DeviceThresholdCommandService {
        <<interface>>
        +handleUpdateThreshold(command)
    }
    class DeviceGateway {
        <<interface>>
        +getDevicesBySpace(spaceId)
        +pairDevice(resource)
    }
    class ClaimDeviceCommand {
        +serialNumber: string
    }
    class PairDeviceCommand {
        +deviceId: DeviceId
        +pairingCode: string
    }
}

namespace infrastructure {
    class DeviceHttpGateway {
        +claimDevice(resource)
        +pairDevice(resource)
    }
    class DeviceThresholdHttpGateway {
        +getThresholds(deviceId)
    }
    class DeviceResource {
        +id: string
        +serialNumber: string
    }
}

%% Relationships
SpaceDevicesPage --> DeviceQueryService : uses
SpaceDevicesPage --> DeviceCommandService : uses

DeviceQueryServiceImpl ..|> DeviceQueryService : implements
DeviceCommandServiceImpl ..|> DeviceCommandService : implements
DeviceContextFacadeImpl ..|> DeviceContextFacade : implements

DeviceQueryServiceImpl --> DeviceGateway : uses
DeviceCommandServiceImpl --> DeviceGateway : uses

DeviceQueryServiceImpl --> DeviceTransform : uses
DeviceCommandServiceImpl --> DeviceTransform : uses

DeviceHttpGateway ..|> DeviceGateway : implements
DeviceHttpGateway --> DeviceResource : maps
DeviceHttpGateway --> OrganizationResource : maps

DeviceTransform --> Device : maps to
DeviceTransform --> DeviceResource : maps from

DeviceCommandServiceImpl --> CreateOrganizationCommand : receives
DeviceQueryServiceImpl --> GetDevicesBySpaceQuery : receives
```

---

# Layers

## Interfaces - Devices

```mermaid
---
title: Interfaces - Devices
---
classDiagram
namespace interfaces {
    class SpaceDevicesPage {
        +onInit()
        +onClaimDevice()
    }
    class DeviceTransform {
        <<service>>
        +deviceResourceToDomain(resource)
        +deviceToResource(device)
    }
    class DeviceContextFacade {
        <<interface>>
        +getDeviceById(id)
    }
}

%% External classes referenced
class DeviceQueryService
class DeviceCommandService
class Device
class DeviceResource

SpaceDevicesPage --> DeviceQueryService : uses
SpaceDevicesPage --> DeviceCommandService : uses
DeviceTransform --> Device : maps to
DeviceTransform --> DeviceResource : maps from
```

## Application - Devices

```mermaid
---
title: Application - Devices
---
classDiagram
namespace application {
    class DeviceCommandServiceImpl {
        +handleCreateOrganization(command)
        +handleClaimDevice(command)
        +handlePairDevice(command)
        +handleQueueDeviceCommand(command)
    }
    class DeviceQueryServiceImpl {
        +handleGetDevicesBySpace(query)
        +handleGetOrganizationById(query)
    }
    class DeviceThresholdCommandServiceImpl {
        +handleCreateThreshold(command)
        +handleUpdateThreshold(command)
    }
    class DeviceThresholdQueryServiceImpl {
        +handleGetThresholdsByDevice(query)
    }
}

%% External classes referenced
class DeviceQueryService
class DeviceCommandService
class DeviceContextFacade
class DeviceGateway
class DeviceTransform
class CreateOrganizationCommand
class GetDevicesBySpaceQuery
class DeviceContextFacadeImpl

DeviceQueryServiceImpl ..|> DeviceQueryService : implements
DeviceCommandServiceImpl ..|> DeviceCommandService : implements
DeviceContextFacadeImpl ..|> DeviceContextFacade : implements
DeviceQueryServiceImpl --> DeviceGateway : uses
DeviceCommandServiceImpl --> DeviceGateway : uses
DeviceQueryServiceImpl --> DeviceTransform : uses
DeviceCommandServiceImpl --> DeviceTransform : uses
DeviceCommandServiceImpl --> CreateOrganizationCommand : receives
DeviceQueryServiceImpl --> GetDevicesBySpaceQuery : receives
```

## Domain - Devices

```mermaid
---
title: Domain - Devices
---
classDiagram
namespace domain {
    class Organization {
        +id: OrganizationId
        +name: string
    }
    class Space {
        +id: SpaceId
        +name: string
    }
    class Device {
        +id: DeviceId
        +serialNumber: string
        +status: DeviceStatus
        +hardwareId: HardwareId
    }
    class DeviceCommandService {
        <<interface>>
        +handleClaimDevice(command)
        +handlePairDevice(command)
    }
    class DeviceThresholdCommandService {
        <<interface>>
        +handleUpdateThreshold(command)
    }
    class DeviceGateway {
        <<interface>>
        +getDevicesBySpace(spaceId)
        +pairDevice(resource)
    }
    class ClaimDeviceCommand {
        +serialNumber: string
    }
    class PairDeviceCommand {
        +deviceId: DeviceId
        +pairingCode: string
    }
}
```

## Infrastructure - Devices

```mermaid
---
title: Infrastructure - Devices
---
classDiagram
namespace infrastructure {
    class DeviceHttpGateway {
        +claimDevice(resource)
        +pairDevice(resource)
    }
    class DeviceThresholdHttpGateway {
        +getThresholds(deviceId)
    }
    class DeviceResource {
        +id: string
        +serialNumber: string
    }
}

%% External classes referenced
class DeviceGateway
class OrganizationResource

DeviceHttpGateway ..|> DeviceGateway : implements
DeviceHttpGateway --> DeviceResource : maps
DeviceHttpGateway --> OrganizationResource : maps
```
