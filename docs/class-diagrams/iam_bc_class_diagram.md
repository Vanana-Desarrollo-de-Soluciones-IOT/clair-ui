```mermaid
---
title: IAM Bounded Context - Class Diagram
---

classDiagram

namespace interfaces {
    class LoginPageComponent {
        +onSignIn()
        +onSignInWithGoogle()
    }
    class RegisterPageComponent {
        +onSignUp()
    }
    class ConfirmPageComponent {
        +onConfirm()
    }
    class AuthInterceptor {
        +intercept(request, next)
    }
}

namespace application {
    class AuthCommandServiceImpl {
        +handleSignIn(command)
        +handleSignUp(command)
        +handleConfirmRegistration(command)
        +handleRefreshToken(command)
    }
    class AuthQueryServiceImpl {
        +handleVerifyToken(query)
    }
}

namespace domain {
    class AuthCommandService {
        <<interface>>
        +handleSignIn(command)
        +handleSignUp(command)
    }
    class AuthQueryService {
        <<interface>>
        +handleVerifyToken(query)
    }
    class AuthGateway {
        <<interface>>
        +signIn(resource)
        +signUp(resource)
        +confirmRegistration(resource)
    }
    class TokenStorageGateway {
        <<interface>>
        +saveTokens(accessToken, refreshToken)
        +getAccessToken()
        +clearTokens()
    }
    class SignInCommand {
        +email: Email
        +password: Password
    }
    class SignUpCommand {
        +email: Email
        +password: Password
    }
}

namespace infrastructure {
    class AuthHttpGateway {
        +signIn(resource)
        +signUp(resource)
    }
    class LocalTokenStorageGateway {
        +saveTokens(accessToken, refreshToken)
        +getAccessToken()
    }
    class AuthResponseResource {
        +accessToken: string
        +refreshToken: string
    }
}

%% Relationships
LoginPageComponent --> AuthCommandService : uses
RegisterPageComponent --> AuthCommandService : uses
ConfirmPageComponent --> AuthCommandService : uses

AuthCommandServiceImpl ..|> AuthCommandService : implements
AuthQueryServiceImpl ..|> AuthQueryService : implements

AuthCommandServiceImpl --> AuthGateway : uses
AuthCommandServiceImpl --> TokenStorageGateway : uses
AuthQueryServiceImpl --> AuthGateway : uses

AuthHttpGateway ..|> AuthGateway : implements
LocalTokenStorageGateway ..|> TokenStorageGateway : implements

AuthInterceptor --> TokenStorageGateway : uses
```
