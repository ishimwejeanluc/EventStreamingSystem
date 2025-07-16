<?php
// User.php
// This file defines the User model, representing a user in the system.

require_once __DIR__ . '/../utils/enums/UserRole.php';
require_once __DIR__ . '/../utils/enums/UserStatus.php';

class User {
    // User properties
    private string $id;
    private string $username;
    private string $email;
    private string $password;
    private UserRole $role;
    private UserStatus $status;
    private ?string $createdBy;
    private ?string $updatedBy;

    /**
     * User constructor: creates a new user object
     * @param string $id Unique user ID
     * @param string $username User's name
     * @param string $email User's email
     * @param string $password User's password (hashed)
     * @param UserRole|null $role User's role (optional)
     * @param UserStatus|null $status User's status (optional)
     * @param string|null $createdBy Who created the user (optional)
     * @param string|null $updatedBy Who last updated the user (optional)
     */
    public function __construct(
        string $id,
        string $username,
        string $email,
        string $password,
        ?UserRole $role = null,
        ?UserStatus $status = null,
        ?string $createdBy = null,
        ?string $updatedBy = null
    ) {
        $this->id = $id;
        $this->username = $username;
        $this->email = $email;
        $this->password = $password;
        $this->role = $role ?? UserRole::getDefault();
        $this->status = $status ?? UserStatus::getDefault();
        $this->createdBy = $createdBy;
        $this->updatedBy = $updatedBy;
    }

    // Getters: return property values
    public function getId(): string { return $this->id; }
    public function getUsername(): string { return $this->username; }
    public function getEmail(): string { return $this->email; }
    public function getPassword(): string { return $this->password; }
    public function getRole(): UserRole { return $this->role; }
    public function getStatus(): UserStatus { return $this->status; }
    public function getCreatedBy(): ?string { return $this->createdBy; }
    public function getUpdatedBy(): ?string { return $this->updatedBy; }

    // Setters: update property values
    public function setId(string $id): void { $this->id = $id; }
    public function setUsername(string $username): void { $this->username = $username; }
    public function setEmail(string $email): void { $this->email = $email; }
    public function setPassword(string $password): void { $this->password = $password; }
    public function setRole(UserRole $role): void { $this->role = $role; }
    public function setStatus(UserStatus $status): void { $this->status = $status; }
    public function setCreatedBy(?string $userId): void { $this->createdBy = $userId; }
    public function setUpdatedBy(?string $userId): void { $this->updatedBy = $userId; }
}
