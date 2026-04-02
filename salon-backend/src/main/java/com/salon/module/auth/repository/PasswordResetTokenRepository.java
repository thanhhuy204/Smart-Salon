package com.salon.module.auth.repository;

import com.salon.module.auth.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByTokenAndIsUsedFalse(String token);

    @Query("SELECT t FROM PasswordResetToken t WHERE t.user.id = :userId AND t.token = :token AND t.isUsed = false")
    Optional<PasswordResetToken> findByUserIdAndTokenAndIsUsedFalse(@Param("userId") Long userId,
                                                                     @Param("token") String token);

    @Modifying
    @Query("DELETE FROM PasswordResetToken t WHERE t.user.id = :userId AND t.isUsed = false")
    void deleteUnusedByUserId(@Param("userId") Long userId);
}
