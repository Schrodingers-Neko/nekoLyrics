cmake_minimum_required(VERSION 3.15)
project(MediaBridge LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Enable C++/WinRT (Modern C++17, no /ZW required)
add_compile_options(/EHsc)
add_definitions(-D_WIN32_WINNT=0x0A00) # Target Windows 10

add_executable(MediaBridge main.cpp)

# Link Windows Runtime libraries
target_link_libraries(MediaBridge PRIVATE 
    WindowsApp.lib
)

# Optimization for size
if(MSVC)
    target_compile_options(MediaBridge PRIVATE /O2 /MD /GL)
    target_link_options(MediaBridge PRIVATE /LTCG)
endif()
