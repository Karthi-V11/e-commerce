package com.shopsphere.service.impl;

import com.shopsphere.dto.request.AddressRequest;
import com.shopsphere.dto.response.AddressResponse;
import com.shopsphere.entity.Address;
import com.shopsphere.entity.User;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.mapper.AddressMapper;
import com.shopsphere.repository.AddressRepository;
import com.shopsphere.repository.UserRepository;
import com.shopsphere.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final AddressMapper addressMapper;

    @Override
    @Transactional(readOnly = true)
    public List<AddressResponse> getMyAddresses(Long userId) {
        return addressRepository.findByUserId(userId).stream().map(addressMapper::toResponse).toList();
    }

    @Override
    @Transactional
    public AddressResponse addAddress(Long userId, AddressRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Address address = Address.builder()
                .user(user)
                .label(request.getLabel())
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .line1(request.getLine1())
                .line2(request.getLine2())
                .city(request.getCity())
                .state(request.getState())
                .postalCode(request.getPostalCode())
                .country(request.getCountry())
                .isDefault(request.isDefault())
                .build();

        return addressMapper.toResponse(addressRepository.save(address));
    }

    @Override
    @Transactional
    public AddressResponse updateAddress(Long userId, Long addressId, AddressRequest request) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));
        if (!address.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("Not your address");
        }
        address.setLabel(request.getLabel());
        address.setFullName(request.getFullName());
        address.setPhone(request.getPhone());
        address.setLine1(request.getLine1());
        address.setLine2(request.getLine2());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPostalCode(request.getPostalCode());
        address.setCountry(request.getCountry());
        address.setDefault(request.isDefault());
        return addressMapper.toResponse(addressRepository.save(address));
    }

    @Override
    @Transactional
    public void deleteAddress(Long userId, Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));
        if (!address.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("Not your address");
        }
        addressRepository.delete(address);
    }
}
